import { useState, useEffect } from "react";

export function useAutoSearch(query) {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const trimmedQuery = query.trim();
    let debounce;
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://6885236e000354b6d049.fra.appwrite.run?query=${encodeURIComponent(trimmedQuery)}`,
        );
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setSuggestions([]);
      }
    };
    if (trimmedQuery.length === 0) {
      setSuggestions([]);
      return;
    }
    if (trimmedQuery.length < 3) {
      fetchSuggestions();
    } else {
      debounce = setTimeout(fetchSuggestions, 400);
    }
    return () => {
      if (debounce) clearTimeout(debounce);
    };
  }, [query]);

  return suggestions;
}

// WE CANT MAKE THIS A NORMAL METHOD LIKE SERVICE OR AUTH BCOZ WE NEED TO USE DEBOUNCING METHOD WHICH CANT BE USED WITHOUT A HOOK (USEEFFECT) IF USING REACT.....NOW IF WE ARE USING A HOOK ACC TO REACT "Hooks can only be called inside the body of a function component or a custom hook." SO WE CANT MAKE IT A METHOD AND WE MAKE A NEW CUSTOM HOOK.
