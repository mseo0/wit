import React, { createContext, useState, useEffect, PropsWithChildren } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

type Flashcard = {
  id: number;
  setId: string;
  front: any[]; // Replace `any` with the appropriate type for your canvas data
  back: any[];
};

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: () => void;
  logOut: () => void;
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (index: number, flashcard: Flashcard) => void;
  backHome: () => void; // Added backHome to the type
  getFlashcardSets: () => Flashcard[]; // Add method to retrieve flashcard sets
  createNewSet: () => string; // Add method to create a new setId
  setFlashcardCount: (count: number) => void; // Add method to update flashcard count
  flashcardCount: number; // Add property to store total flashcard count
};

const authStorageKey = "auth-key";
const flashcardsStorageKey = "flashcards-key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  logIn: () => {},
  logOut: () => {},
  flashcards: [],
  addFlashcard: () => {},
  updateFlashcard: () => {},
  backHome: () => {}, // Added backHome to the default context
  getFlashcardSets: () => [], // Default implementation
  createNewSet: () => "", // Default implementation
  setFlashcardCount: () => {}, // Default implementation
  flashcardCount: 0, // Default value
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [nextSetId, setNextSetId] = useState(1); // Track the next setId
  const [flashcardCount, setFlashcardCount] = useState(0); // State to track total flashcard count
  const router = useRouter();

  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving auth state", error);
    }
  };

  const storeFlashcards = async (newFlashcards: Flashcard[]) => {
    try {
      const jsonValue = JSON.stringify(newFlashcards);
      await AsyncStorage.setItem(flashcardsStorageKey, jsonValue);
    } catch (error) {
      alert("Error saving flashcards: " + error);
      console.error("Error saving flashcards", error);
    }
  };

  const addFlashcard = (flashcard: Flashcard) => {
    const updatedFlashcards = [...flashcards, flashcard];
    setFlashcards(updatedFlashcards);
    storeFlashcards(updatedFlashcards);
  };

  const updateFlashcard = (index: number, flashcard: Flashcard) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index] = flashcard;
    setFlashcards(updatedFlashcards);
    storeFlashcards(updatedFlashcards);
  };

  const getFlashcardSets = () => {
    return flashcards; // Return the current flashcards
  };

  const createNewSet = () => {
    const newSetId = `set${nextSetId}`;
    setNextSetId(nextSetId + 1); // Increment the setId for the next set
    return newSetId;
  };

  const signUp = () => {
    router.replace("/signup/signup");
  };

  const logIn = () => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });
    router.replace("/");
  };

  const logOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
    router.replace("/login");
  };

  const backHome = () => {
    router.back(); // Corrected path to match the intended route
  };

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const storedFlashcards = await AsyncStorage.getItem(flashcardsStorageKey);
        if (storedFlashcards) {
          const parsedFlashcards = JSON.parse(storedFlashcards);
          setFlashcards(parsedFlashcards);

          // Determine the next setId based on existing flashcards
          const maxSetId = parsedFlashcards.reduce((max, card) => {
            const setIdNumber = parseInt(card.setId.replace("set", ""), 10);
            return Math.max(max, setIdNumber);
          }, 0);
          setNextSetId(maxSetId + 1);
        }
      } catch (error) {
        console.error("Error loading flashcards", error);
      }
    };

    const getAuthFromStorage = async () => {
      // Simulate a delay, e.g., for an API request
      await new Promise((res) => setTimeout(() => res(null), 1000));
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log("Error fetching auth state from storage", error);
      }
      setIsReady(true);
    };

    loadFlashcards();
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    // Update flashcard count whenever flashcards change
    setFlashcardCount(flashcards.length);
  }, [flashcards]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        logIn,
        logOut,
        flashcards,
        addFlashcard,
        updateFlashcard,
        backHome, // Added backHome to the provider
        getFlashcardSets, // Provide the method in the context
        createNewSet, // Provide the method in the context
        setFlashcardCount, // Provide method to update flashcard count
        flashcardCount, // Provide total flashcard count
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}