import { Box, Button, ChakraProvider, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Input, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import Head from "next/head";
import React, { useState } from "react";

export default function Home() {
    const [formData, setFormData] = useState({
        loanType: "",
        loanAmount: 0,
        term: 0,
        creditScore: "",
        houseAge: 0,
    });
    const [errors, setErrors] = useState({
        loanType: false,
        loanAmount: false,
        term: false,
        creditScore: false,
        houseAge: false,
    });

    const API_URL = "https://home-loan.matthayward.workers.dev/calculate";

    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    const validateLoanType = (value: string) => {
        if (value === "Fixed Rate" || value === "Variable Rate" || value === "Interest Only") {
            setFormData({ ...formData, loanType: value });
            setErrors({ ...errors, loanType: false });
        } else {
            setErrors({ ...errors, loanType: true });
        }
    }

    const validateLoanAmount = (value: string) => {
        const amount = parseFloat(value);
        if (amount > 0) {
            setFormData({ ...formData, loanAmount: amount });
            setErrors({ ...errors, loanAmount: false });
        } else {
            setErrors({ ...errors, loanAmount: true });
        }
    }

    const validateTerm = (value: string) => {
        const term = parseInt(value, 10);
        const loanType = formData.loanType;

        let min = 1;
        let max = 30;

        if (loanType === "Fixed Rate") {
            max = 30; 
        } else if (loanType === "Variable Rate") {
            max = 30; 
        } else if (loanType === "Interest Only") {
            max = 10;; 
        } else {
            setErrors({ ...errors, term: true });
            return;
        }

        if (term > 0) {
            setFormData({ ...formData, term: term });
            setErrors({ ...errors, term: false });
        } else {
            setErrors({ ...errors, term: true });
        }
    }

    const validateCreditScore = (value: string) => {
        if (value === "Excellent" || value === "Good" || value === "Fair" || value === "Poor") {
            setFormData({ ...formData, creditScore: value });
            setErrors({ ...errors, creditScore: false });
        } else {
            setErrors({ ...errors, creditScore: true });
        }
    }

    const validateHouseAge = (value: string) => {
    const age = parseInt(value, 10);

    if (!value || isNaN(age) || age <= 0) {
        setErrors({ ...errors, houseAge: true });
    } else {
        setFormData({ ...formData, houseAge: age });
        setErrors({ ...errors, houseAge: false });
    }
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted successfully:", formData);
            try {
                console.log("Sending to API:", JSON.stringify(formData, null, 2));

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setMonthlyPayment(data.monthlyPayment);
                console.log("Calculation result:", data);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        } else {
            console.log("Form validation failed");
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!formData.loanType) {
            newErrors.loanType = true;
            isValid = false;
        } else {
            newErrors.loanType = false;
        }

        if (formData.loanAmount <= 0) {
            newErrors.loanAmount = true;
            isValid = false;
        } else {
            newErrors.loanAmount = false;
        }

        if (formData.term <= 0) {
            newErrors.term = true;
            isValid = false;
        } else {
            newErrors.term = false;
        }

        if (!formData.creditScore) {
            newErrors.creditScore = true;
            isValid = false;
        } else {
            newErrors.creditScore = false;
        }

        if (formData.houseAge <= 0) {
            newErrors.houseAge = true;
            isValid = false;
        } else {
            newErrors.houseAge = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <ChakraProvider>
            <Heading p={6}>Let's help with your home loan!</Heading>
            <form onSubmit={handleSubmit} noValidate>
                <Grid templateColumns="repeat(2, 1fr)" gap={2} px={2} p={6}>
                    <GridItem>
                        <FormControl isRequired isInvalid={errors.loanType}>
                            <FormLabel htmlFor="LoanType">Loan Type</FormLabel>
                            <RadioGroup onChange={(value) => validateLoanType(value)} value={formData.loanType}>
                            <HStack spacing={6}>
                                <Radio value="Fixed Rate">Fixed Rate</Radio>
                                <Radio value="Variable Rate">Variable Rate</Radio>
                                <Radio value="Interest Only">Interest Only</Radio>
                            </HStack>
                            </RadioGroup>
                            <FormErrorMessage>Please select a loan type.</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={errors.loanAmount} mt={4}>
                            <FormLabel htmlFor="LoanAmount">Loan Amount</FormLabel>
                            <Input type="number" id="LoanAmount" name="LoanAmount" placeholder="Enter loan amount" width="30%" onChange={(e) => validateLoanAmount(e.target.value)}/>
                            <FormErrorMessage>Please enter a valid loan amount.</FormErrorMessage>
                        </FormControl>
                    </GridItem>

                    <GridItem>
                        <VStack>
                            <FormControl isRequired isInvalid={errors.term}>
                                <FormLabel htmlFor="term">Loan Term (years)</FormLabel>
                                <Input type="number" id="term" name="term" placeholder="Enter loan term in years" value={formData.term} width="30%" onChange={(e) => validateTerm(e.target.value)}/>
                                <FormErrorMessage>
                                    {formData.loanType === "InterestOnly"
                                        ? "Loan term must be between 1 and 10 years."
                                        : "Loan term must be between 1 and 30 years."}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.creditScore}>
                                <FormLabel htmlFor="CreditScore">Credit Score</FormLabel>
                                <RadioGroup onChange={(value) => validateCreditScore(value)} value={formData.creditScore}>
                                    <HStack spacing={6}>
                                        <Radio value="Excellent">Excellent</Radio>
                                        <Radio value="Good">Good</Radio>
                                        <Radio value="Fair">Fair</Radio>
                                        <Radio value="Poor">Poor</Radio>
                                    </HStack>
                                </RadioGroup>
                                <FormErrorMessage>Please select a credit score.</FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.houseAge}>
                                <FormLabel htmlFor="houseAge">House Age (years)</FormLabel>
                                <Input type="number" id="houseAge" name="houseAge" placeholder="Enter house age in years" width="30%" min={1} value={formData.houseAge} onChange={(e) => validateHouseAge(e.target.value)}/>
                                <FormErrorMessage>Please enter a valid house age.</FormErrorMessage>
                            </FormControl>
                        </VStack>
                    </GridItem>
                </Grid>
                <FormControl>
                    <Button m={6} type="submit" width="100%">Calculate</Button>
                </FormControl>
                <Box>
                    {monthlyPayment !== null && (
                        <Heading as="h2" size="md" p={6}>
                            Your estimated monthly payment is: ${monthlyPayment.toFixed(2)}
                        </Heading>
                    )}
                </Box>
            </form>
        </ChakraProvider>
    )
}
