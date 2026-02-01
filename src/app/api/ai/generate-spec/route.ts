import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Mock AI Generation Logic based on Canvas Nodes
    // In a real app, this would call OpenAI with the nodes/edges JSON
    const userStories = nodes.filter((n: any) => n.type === 'userStory');
    const screens = nodes.filter((n: any) => n.type === 'screen');
    
    let specMarkdown = `# Engineering Specification: ${project.name}\n\n`;
    specMarkdown += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;
    
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

    specMarkdown += `## 5. API Endpoints\n`;
    specMarkdown += `- \`POST /api/resource\`\n`;
    specMarkdown += `- \`GET /api/resource/:id\`\n`;

    // Log Usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: project.teamId,
        action: 'generate_spec',
        inputTokens: JSON.stringify(nodes).length / 4,
        outputTokens: specMarkdown.length / 4,
        model: 'gpt-mock-spec'
      }
    });

    return NextResponse.json({ spec: specMarkdown });

  } catch (error) {
    console.error('Error generating spec:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
