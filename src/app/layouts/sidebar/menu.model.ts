export interface MenuItem {
    id?: number;
    label?: string;
    icon?: string;
    link?: string;
    /** Acción especial (p. ej. logout) en lugar de navegar */
    action?: 'logout';
    subItems?: any;
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
}
