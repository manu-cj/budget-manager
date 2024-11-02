export interface Budget {
    id: string;
    user_id: string;
    housing: number;
    food: number;
    transportation: number;
    health: number;
    leisure: number;
    subscriptions: number;
    insurance: number;
    education: number;
    repayments: number;
    savings: number;
    gifts_and_events: number;
    miscellaneous: number;
    created_at: string;  // TIMESTAMP format, typiquement en ISO 8601
    updated_at: string;  // TIMESTAMP format, typiquement en ISO 8601
}

