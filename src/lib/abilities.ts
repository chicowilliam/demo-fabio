import { AbilityBuilder, PureAbility } from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = 'Supermarket' | 'Layout' | 'User' | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

export const createAbility = (role: 'shopper' | 'admin'): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as any);

  if (role === 'admin') {
    // Admin can do everything
    can('manage', 'all');
  } else {
    // Shopper can only read public data
    can('read', 'Supermarket');
    can('read', 'Layout');
    can('read', 'User');
    cannot('create', 'Supermarket');
    cannot('update', 'Supermarket');
    cannot('delete', 'Supermarket');
  }

  return build();
};
