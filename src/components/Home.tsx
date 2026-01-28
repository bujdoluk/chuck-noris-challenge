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
  const [favouriteJokes, setFavouriteJokes] = useState<Array<Joke>>([]);

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

  const onFetchJoke = (): void => {
    if (intervalRef.current) {
      return;
    }

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

  const onFetchNewJoke = async (): Promise<void> => {
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
        setJokes((previousJokes: Array<Joke>) => [...previousJokes, newJoke]);
      }
    }, CONSTANTS.REFRESH_INTERVAL);

    const firstJoke = await fetchJoke();
    if (firstJoke) {
      setJokes((previousJokes: Array<Joke>) => [...previousJokes, firstJoke]);
    }
  };

  const addToFavourites = (favouriteJoke: Joke): void => {
    setFavouriteJokes((previousJokes: Array<Joke>) => {
      const favouriteJokes = localStorage.getItem("favouriteJokes");
      const savedFavourites: Array<Joke> = favouriteJokes
        ? JSON.parse(favouriteJokes)
        : previousJokes;

      if (savedFavourites.find((joke: Joke) => joke.id === favouriteJoke.id))
        return savedFavourites;

      const maxJokes = [...savedFavourites, favouriteJoke].slice(
        -CONSTANTS.MAX_FAVOURITES_JOKES
      );
      localStorage.setItem("favouriteJokes", JSON.stringify(maxJokes));

      return maxJokes;
    });
  };

  const removeFromFavourites = (favouriteJoke: Joke): void => {
    setFavouriteJokes((previousJokes: Array<Joke>) => {
      const favouriteJokes = localStorage.getItem("favouriteJokes");
      const savedFavourites: Array<Joke> = favouriteJokes
        ? JSON.parse(favouriteJokes)
        : previousJokes;

      const filteredJokes = savedFavourites.filter(
        (joke) => joke.id !== favouriteJoke.id
      );
      localStorage.setItem("favouriteJokes", JSON.stringify(filteredJokes));
      return filteredJokes;
    });
  };

  useEffect(() => {
    const onKeyboardEvent = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === "r") {
        onFetchJoke();
      }
    };

    window.addEventListener("keydown", onKeyboardEvent);

    return () => {
      window.removeEventListener("keydown", onKeyboardEvent);
    };
  }, []);

  return (
    <div className="home">
      <button className="button" onClick={onFetchJoke} disabled={loadingJoke}>
        {loadingJoke ? "Loading..." : "Get One Joke"}
      </button>

      {joke && (
        <div className="grid">
          <JokeItem
            joke={joke}
            favouriteJokes={favouriteJokes}
            onAddToFavourites={addToFavourites}
            onRemoveFromFavourites={removeFromFavourites}
          />
        </div>
      )}

      <button
        className="button"
        onClick={onFetchNewJoke}
        disabled={loadingNewJoke && !intervalRef.current}
      >
        {intervalRef.current ? t("stop") : t("getJokeEveryTreeSeconds")}
      </button>

      {jokes.length > 0 && (
        <div className="grid">
          {jokes.map((joke: Joke) => (
            <JokeItem
              key={joke.id}
              joke={joke}
              favouriteJokes={favouriteJokes}
              onAddToFavourites={addToFavourites}
              onRemoveFromFavourites={removeFromFavourites}
            />
          ))}
        </div>
      )}

      <button
        className="button"
        onClick={async (): Promise<void> => await navigate("/favourites")}
      >
        {t("goToFavourites")}
      </button>
    </div>
  );
}
