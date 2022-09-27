<script lang="ts">
  import ReviewForm from "./review-form.svelte";
  import type { IReview } from "../interfaces";
  export let reviews: IReview[] = [];

  function openReply(r: IReview) {
    reviews = reviews.map((review) => {
      if (review.ID == r.ID) {
        review.openReply = true;
      } else {
        review.openReply = false;
      }
      return review;
    });
  }
</script>

<div class="comments w-full">
  {#each reviews as review, i}
    <div class="rounded-xl border p-5 bg-white mb-6" data-id="12345">
      <div class="flex w-full items-center justify-between border-b pb-3">
        <div class="flex items-center space-x-3">
          <div style="background: url('https://www.gravatar.com/avatar/{review.Avatar}?s=32');"
            class="h-8 w-8 rounded-full bg-slate-400"
          />
          <div class="text-lg font-bold text-slate-700">
            {review.Nickname}
          </div>
        </div>
        <div class="flex items-center space-x-8">
          <div class="text-xs text-neutral-500">{review.UpdatedAt}</div>
        </div>
      </div>
      <div class="mt-4 mb-6">
        {@html review.Html}
      </div>
      <div>
        <div class="flex items-center justify-end text-slate-500 ">
          <div
            class="flex space-x-4 md:space-x-8"
            on:click={() => {
              openReply(review);
            }}
          >
            <div
              class="flex cursor-pointer items-center transition hover:text-slate-600"
            >
              reply
              <!-- <svg class="mr-1.5 h-5 w-5">
                <use xlink:href="#icon-reply" />
              </svg> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    {#if review.openReply}
      <ReviewForm bind:review bind:reviews />
    {/if}
  {/each}
</div>
