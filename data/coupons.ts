export interface Coupon {
    code: string;
    discount: number; // porcentaje (si type==='percent') o monto fijo (si type==='fixed')
    type: 'percent' | 'fixed';
    targetId?: string; // si está presente, aplica solo a ese item
}

// Ejemplos de cupones. Puedes editarlos según necesites.
export const COUPONS: Coupon[] = [
    { code: 'WELCOME10', discount: 10, type: 'percent' },
    { code: 'CURSO50', discount: 50, type: 'fixed', targetId: 'course-marketing' },
    { code: 'RESOURCE5', discount: 5, type: 'fixed' },
    { code: 'HALFOFF', discount: 50, type: 'percent', targetId: 'course-operations' }
];

export default COUPONS;
