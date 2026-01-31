import { useState, useEffect } from 'react';
import { getPlanLimits, PlanLimits, PlanType } from '@/lib/permissions';

export interface SubscriptionState {
  plan: PlanType;
  status: string;
  limits: PlanLimits;
  isLoading: boolean;
}

// In a real app, this would use SWR or React Query and Context
export function useSubscription(initialTeamId?: string) {
  const [state, setState] = useState<SubscriptionState>({
    plan: PlanType.FREE,
    status: 'active',
    limits: getPlanLimits(PlanType.FREE),
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchSub() {
      try {
        let teamId = initialTeamId;
        let role = '';

        // If no teamId provided, fetch from /api/auth/me
        if (!teamId) {
            const meRes = await fetch('/api/auth/me');
            if (meRes.ok) {
                const meData = await meRes.json();
                teamId = meData.teamId;
                role = meData.user?.role;
            }
        }

        if (!teamId) {
            if (mounted) setState(s => ({ ...s, isLoading: false }));
            return;
        }

        const res = await fetch(`/api/billing/status?teamId=${teamId}`);
        const data = await res.json();
        
        if (mounted && data.subscription) {
          const plan = data.subscription.plan as PlanType;
          setState({
            plan,
            status: data.subscription.status,
            limits: getPlanLimits(plan, role),
            isLoading: false,
          });
        } else if (mounted) {
            // Fallback if no subscription found
             setState({
                plan: PlanType.FREE,
                status: 'active',
                limits: getPlanLimits(PlanType.FREE, role),
                isLoading: false,
              });
        }
      } catch (error) { else if (mounted) {
           // Default to FREE if no sub found
           setState(s => ({ ...s, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to fetch subscription', error);
        if (mounted) setState(s => ({ ...s, isLoading: false }));
      }
    }

    fetchSub();

    return () => { mounted = false; };
  }, [initialTeamId]);

  return state;
}
