export interface Item {
    name: string;
    desc: string;
    pricePerDay: Number;
    pricePerDays: Number;
    type: 'prislusenstvi' | 'kocarek';
    img: string[];
    kauce: string;
    hidden: boolean;
}