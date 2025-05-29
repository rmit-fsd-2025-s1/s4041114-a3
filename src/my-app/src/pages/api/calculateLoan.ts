export default function handler(req: { method: string; body: { loanType: any; loanAmount: any; loanTerm: any; creditScore: any; houseAge: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; monthlyPayment?: number; }): any; new(): any; }; end: { (arg0: string): any; new(): any; }; }; setHeader: (arg0: string, arg1: string[]) => void; }) {
    if (req.method === 'POST') {
        const { loanType, loanAmount, loanTerm, creditScore, houseAge } = req.body;

        if (!loanType || !loanAmount || !loanTerm || !creditScore || !houseAge) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const interestRate = loanType === 'FixedRate' ? 0.05 : loanType === 'VariableRate' ? 0.04 : 0.06;
        const monthlyPayment = (loanAmount * interestRate / 12) / (1 - Math.pow(1 + interestRate / 12, -loanTerm * 12));

        return res.status(200).json({ monthlyPayment });
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}