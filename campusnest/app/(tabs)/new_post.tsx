import React, {useEffect, useState} from "react";
import { ActivityIndicator, Alert, Pressable, Role, ScrollView, StyleSheet, Text, TextInput, View,} from "react-native";
import {supabase} from "@/src/lib/supabaseClient";
import {useRouter} from "expo-router";

export default function NewPostScreen() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null >(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // landlord form state
  const [listingTitle, setListingTitle] = useState("");
  const [listingAddress, setListingAddress] = useState("");
  const [listingRent, setListingRent] = useState("");
  const [listingLeaseTerm, setListingLeaseTerm] = useState("");

  //student post state
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

}