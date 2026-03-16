---
trigger: glob
globs: "**/*.tsx,**/*.ts,**/*.jsx"
description: Enforce modern React with TypeScript best practices
---

# ⚛️ React & TypeScript Guidelines

<react_standards>
## Component Structure
```typescript
// Preferred: Function components with explicit return types
interface Props {
  userId: string;
  initialData?: User;
}

export const UserProfile: React.FC<Props> = ({ 
  userId, 
  initialData 
}) => {
  // Hooks at top level
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    initialData
  });

  if (isLoading) return <Spinner />;
  if (!data) return <NotFound />;

  return <ProfileView user={data} />;
};
```

## State Management
- Use Zustand for global state
- TanStack Query for server state
- Context only for theme/auth/user
- Colocate state when possible

## Custom Hooks Pattern
```typescript
// Encapsulate complex logic
function useUserManagement(userId: string) {
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery(...);
  
  const updateUser = useMutation({
    mutationFn: (data) => api.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    }
  });

  return { user, updateUser };
}
```

## Performance Rules
- Memoize expensive computations
- Use useCallback for function props
- Virtualize long lists
- Lazy load routes and heavy components
</react_standards>
