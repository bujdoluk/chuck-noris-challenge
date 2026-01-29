import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config/config.json";
import { Joke } from "../types";
import { CONSTANTS } from "../utils/constants.ts";
import { useTranslation } from "react-i18next";
import JokeItem from "./JokeItem.tsx";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [joke, setJoke] = useState<Joke>();
  const [jokes, setJokes] = useState<Array<Joke>>([]);
  const [loadingJoke, setLoading] = useState<boolean>(false);
  const [loadingNewJoke, setNewLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Array<Joke>>(() => {
    const favorites = localStorage.getItem("favoriteJokes");
    return favorites ? JSON.parse(favorites) : [];
  });

  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchJoke = async (): Promise<Joke | void> => {
    try {
      const response: Response = await fetch(config.url);
      const joke: Joke = await response.json();
      return joke;
    } catch (error: unknown) {
      console.error("Could not fetch a joke", error);
    }
  };

  const fetchOneJoke = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(async (): Promise<void> => {
      setLoading(true);
      const joke = await fetchJoke();
      if (joke) {
        setJoke(joke);
      }
      setLoading(false);
    }, CONSTANTS.DEBOUNCE);
  };

  const generateNewJoke = async (): Promise<void> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setNewLoading(false);
      return;
    }

    setNewLoading(true);

    intervalRef.current = window.setInterval(async (): Promise<void> => {
      const newJoke = await fetchJoke();
      if (newJoke) {
        setJokes((jokes: Array<Joke>) => [...jokes, newJoke]);
      }
    }, CONSTANTS.REFRESH_INTERVAL);

    const firstJoke = await fetchJoke();
    if (firstJoke) {
      setJokes((jokes: Array<Joke>) => [...jokes, firstJoke]);
    }
  };

  const addToFavorites = (joke: Joke): void => {
    setFavorites((favorites) => {
      if (favorites.some((favorite) => favorite.id === joke.id))
        return favorites;

      return [...favorites, joke].slice(-CONSTANTS.MAX_FAVORITES_JOKES);
    });
  };

  const removeFromFavorites = (joke: Joke): void => {
    setFavorites((favorites) =>
      favorites.filter((favorite) => favorite.id !== joke.id)
    );
  };

  useEffect(() => {
    localStorage.setItem("favoriteJokes", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === "r") {
        fetchOneJoke();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fetchOneJoke]);

  return (
    <div className="home">
      <button className="button" onClick={fetchOneJoke} disabled={loadingJoke}>
        {loadingJoke ? "Loading..." : "Get One Joke"}
      </button>

      {joke && (
        <div className="grid">
          <JokeItem
            joke={joke}
            favorites={favorites}
            onAdd={addToFavorites}
            onRemove={removeFromFavorites}
          />
        </div>
      )}

      <button className="button" onClick={generateNewJoke}>
        {loadingNewJoke ? t("stop") : t("getJokeEveryTreeSeconds")}
      </button>

      {jokes.length > 0 && (
        <div className="grid">
          {jokes.map((joke: Joke) => (
            <JokeItem
              key={joke.id}
              joke={joke}
              favorites={favorites}
              onAdd={addToFavorites}
              onRemove={removeFromFavorites}
            />
          ))}
        </div>
      )}

      <button
        className="button"
        onClick={async (): Promise<void> => await navigate("/favorites")}
      >
        {t("goToFavorites")}
      </button>
    </div>
  );
}
