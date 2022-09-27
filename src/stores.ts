// stores.ts
import type { IReview, Response } from './interfaces'
import { writable } from "svelte/store";

export const reviews = writable<IReview[]>([]);

export const fetchReviews = async () => {
  const res = await fetch(`/comments/api/reviews`);
  const response = (await res.json()) as Response;
  const reviewList = response.data as IReview[];
  reviews.set(reviewList);
};

