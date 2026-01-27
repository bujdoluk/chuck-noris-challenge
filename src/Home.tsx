import React, { useState, useRef } from "react";

export default function Home() {
  const [joke, setJoke] = useState<Joke>("");
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  interface Joke {
    text: string;
  }

  const fetchJoke = async (): Promise<void> => {
    try {
      setLoading(true);
      const response: Response = await fetch(
        "https://api.chucknorris.io/jokes/random"
      );
      const data = await response.json();
      setJoke(data.value);
    } catch (error: unknown) {
      console.log("Could not fetch a joke", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.curent = window.setTimeout(async (): Promise<void> => {
      await fetchJoke();
    }, 500);
  };

  return (
    <div className="homePage">
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "GET one joke"}
      </button>
      <button>Click me</button>

      <div className="grid">
        <div>{joke}</div>
      </div>
    </div>
  );
}
