import React, {useEffect, useState} from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabaseClient";

type Role = "student" | "landlord";

type Listing = {
    id: string;
    landlord_id: string;
    title: string;
    address: string;
    rent: number;
    lease_term: string;
    utilties?: string | null;
    bedrooms?: number | null;
    move_in_date?: string | null;
    status : string;
    visibility: string;
    description?: string | null;
    security_deposit?: number | null;
    nearby_university?: string | null;
    is_furnished?: boolean | null;
}

export default function ListingDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [listing, setListing] = useState<Listing | null>(null);
    const [landlordName, setLandlordName] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);

            const {
                data: { session },
            } = await supabase.auth.getSession();
            
            const userRole = session?.user?.user_metadata?.role as Role | undefined;
            if (userRole === "student" || userRole === "landlord") {
                setRole(userRole);
            }

            const {data, error} = await supabase
                .from("listings")
                .select("*")
                .eq("id", id)
                .single();
            
            if (error || !data) {
                console.error("Error fetching listing:", error);
                Alert.alert("Error", "Could not fetch listing details.");
                setLoading(false);
                return;
            }

            setListing(data as Listing);

            if (session?.user?.id && data.landlord_id == session.user.id) {
                setIsOwner(true);
            }

            const {data: profile} = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", data.landlord_id)
                .single();
            
            if (profile?.full_name) {
                setLandlordName(profile.full_name);
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);

    const handleContact = () => {
        Alert.alert("Contact Landlord", "Feature to contact landlord is not implemented yet.");
    };

    const handleEdit = () => {
        Alert.alert("Edit Listing", "Feature to edit listing is not implemented yet.");
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.centeredText}>Loading listing...</Text>
            </View>
        );
    }
}