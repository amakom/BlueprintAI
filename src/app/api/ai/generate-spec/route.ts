import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { openai, isAIConfigured, AI_MODEL } from '@/lib/openai';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectId } = await req.json();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { subscription: true } } }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch Canvas Data
    const canvasDoc = await prisma.document.findFirst({
      where: { projectId, type: 'CANVAS' }
    });

    if (!canvasDoc || !canvasDoc.content) {
      return NextResponse.json({ error: 'Canvas is empty. Add flows to generate a spec.' }, { status: 400 });
    }

    const canvasData = canvasDoc.content as any;
    const nodes = canvasData.nodes || [];
    const edges = canvasData.edges || [];

    // Real AI Generation
    if (isAIConfigured()) {
      try {
        const prompt = `
          You are a Senior Technical Product Manager and System Architect.
          Generate a detailed Engineering Specification (PRD) in Markdown format based on the following Visual Canvas Data.
          
          Project Name: ${project.name}
          Project Description: ${project.description || 'N/A'}
          
          Canvas Nodes (User Stories, Screens, etc.):
          ${JSON.stringify(nodes.map((n: any) => ({ type: n.type, label: n.data.label, details: n.data })))}
          
          Canvas Connections (Flow):
          ${JSON.stringify(edges.map((e: any) => ({ from: e.source, to: e.target })))}
          
          Structure the response as a professional Technical Spec with the following sections:
          1. Executive Summary
          2. User Flows & User Stories (Detailed breakdown)
          3. Frontend Specifications (Screens, Components, Routes)
          4. Backend Data Models (Prisma Schema suggestions)
          5. API Endpoints (RESTful definitions)
          6. Edge Cases & Error Handling
          
          Output valid Markdown only. Do not wrap in markdown code blocks.
        `;

        const response = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: [
            { role: 'system', content: 'You are an expert Technical Architect.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        });

        const specMarkdown = response.choices[0].message.content || '';

        // Log Usage
        await prisma.aIUsageLog.create({
          data: {
            teamId: project.teamId,
            action: 'generate_spec',
            inputTokens: JSON.stringify(nodes).length / 4, // Approx
            outputTokens: specMarkdown.length / 4, // Approx
            model: AI_MODEL,
          }
        });

        return NextResponse.json({ spec: specMarkdown });

      } catch (aiError) {
        console.error('OpenAI API Error:', aiError);
        // Fallback to mock if AI fails
      }
    }

    // Fallback Mock Logic (if AI not configured or fails)
    console.warn('Using fallback mock generation for spec');
    const userStories = nodes.filter((n: any) => n.type === 'userStory');
    const screens = nodes.filter((n: any) => n.type === 'screen');
    
    let specMarkdown = `# Engineering Specification: ${project.name}\n\n`;
    specMarkdown += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;
    specMarkdown += `> **Note:** This is a mock specification generated because the OpenAI API Key is missing or failed.\n\n`;
    
    specMarkdown += `## 1. Overview\n`;
    specMarkdown += `This document outlines the technical implementation details for the ${project.name} user flows.\n\n`;

    specMarkdown += `## 2. User Stories (${userStories.length})\n`;
    if (userStories.length > 0) {
      userStories.forEach((node: any) => {
        specMarkdown += `### ${node.data.label || 'Untitled Story'}\n`;
        specMarkdown += `- **Acceptance Criteria**: ${node.data.criteria || 'Implement as designed.'}\n`;
        specMarkdown += `- **Priority**: High\n\n`;
      });
    } else {
      specMarkdown += `_No user stories defined._\n\n`;
    }

    specMarkdown += `## 3. Frontend Implementation\n`;
    if (screens.length > 0) {
      specMarkdown += `### Screens Required:\n`;
      screens.forEach((node: any) => {
        specMarkdown += `- **${node.data.label || 'Untitled Screen'}**\n`;
        specMarkdown += `  - Route: \`/app/${(node.data.label || 'screen').toLowerCase().replace(/\s+/g, '-')}\`\n`;
        specMarkdown += `  - Components: Header, Layout, ${node.data.label}Form\n`;
      });
    } else {
      specMarkdown += `_No screens defined._\n\n`;
    }

    specMarkdown += `\n## 4. Data Models\n`;
    specMarkdown += `Based on the entities identified in the flow:\n`;
    specMarkdown += "```prisma\n";
    specMarkdown += "model Entity {\n  id String @id @default(cuid())\n  createdAt DateTime @default(now())\n}\n";
    specMarkdown += "```\n\n";

    return NextResponse.json({ spec: specMarkdown });

  } catch (error) {
    console.error('Error generating spec:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
