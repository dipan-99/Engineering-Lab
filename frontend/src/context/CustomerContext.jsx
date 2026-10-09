import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
    const [customer, setCustomer] = useState(null);
    const [customerLoading, setCustomerLoading] = useState(true);

    const refreshCustomer = async () => {
        try {
            const response = await api.get("/customers/me");
            const profile = response.data.customer ?? response.data;

            setCustomer(profile);
            return profile;
        } catch (error) {
            console.error("Failed to fetch customer:", error);
            throw error;
        }
    };

    useEffect(() => {
        refreshCustomer()
            .catch(() => setCustomer(null))
            .finally(() => setCustomerLoading(false));
    }, []);

    return (
        <CustomerContext.Provider
            value={{
                customer,
                setCustomer,
                refreshCustomer,
                customerLoading,
            }}
        >
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomer() {
    const context = useContext(CustomerContext);

    if (!context) {
        throw new Error("useCustomer must be used inside CustomerProvider");
    }

    return context;
}
