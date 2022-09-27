<script lang="ts">
  import type { IReview, Response } from "src/interfaces";
  import { markdown } from "../libs/markdown";
  export let review: Partial<IReview> = {};
  export let reviews: IReview[] = [];
  const validateEmail = (email) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(email).toLowerCase()
    );
  const validateNickName = (val) => {
    if (String(val).length > 2 && String(val).length < 16) {
      return true
    }else{
      return false
    }
  }
  $: sending = false;
  $: emailErr = false;
  $: nickNameErr = false;
  $: sendCompleted = false;

  let newReview: Partial<IReview> = {};

  async function addReview(r: Partial<IReview>) {
    const nicknameIsValid  = validateNickName(r.Nickname);
    const emailIsValid = validateEmail(r.Email);
    if (!emailIsValid) {
      emailErr = true;
    }
    if (!nicknameIsValid) {
      nickNameErr = true;
    }
    if (emailIsValid && nicknameIsValid && r.Html.length > 0) {
      let addingReview: Partial<IReview> = {
        ...r,
        Post_id: document.querySelector("body").dataset.uuid,
        Parent_id: review.ID ?? 0,
        Html: markdown(r.Html),
      };
      sending = true;
      const res = await fetch("/comments/api/reviews", {
        method: "POST",
        body: JSON.stringify({...addingReview,Domain: "myfreax.com"}),
      });
      sending = false;
      sendCompleted = true;
      const response = (await res.json()) as Response;
      const reviewRes = response.data as IReview;
      reviews.forEach((r) => {
        r.openReply = false;
      });
      sendCompleted = false;
      newReview = {};
      reviews = [reviewRes, ...reviews];
    }
  }
</script>

<div class="w-full flex flex-col  md:flex-row">
  <input
    required
    minlength="3"
    maxlength="15"
    type="text"
    placeholder="Your name"
    on:focus={() => nickNameErr = false}
    name="nickname"
    bind:value={newReview.Nickname}
    class="w-full bg-gray-50 text-gray-700 {nickNameErr ? 'border-red-500' : ''} border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mr-4"
  />
  <input
    required
    type="email"
    placeholder="Your Email"
    on:focus={() => emailErr = false}
    name="email"
    bind:value={newReview.Email}
    class="w-full bg-gray-50 text-gray-700 {emailErr ? 'border-red-500' : ''}  border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mr-4"
  />
</div>
<textarea
  class="w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
  bind:value={newReview.Html}
  name="Html"
  id=""
  cols="20"
  rows="5"
  placeholder="Your Message, markdown Supported"
/>

<div class="w-full mb-8 text-right">
  {#if review.openReply}
    <button
      on:click={() => {
        review.openReply = false;
      }}
      type="button"
      class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2  inline-flex items-center"
    >
      <svg
        class="inline mr-3 w-4 h-4"
        viewBox="0 0 1024 1024"
        version="1.1"
        width="16"
        height="16"
        ><path
          d="M512 451.33l242.679-242.679c16.754-16.753 43.916-16.753 60.67 0 16.753 16.754 16.753 43.916 0 60.67L572.669 512l242.68 242.679c16.753 16.754 16.753 43.916 0 60.67-16.754 16.753-43.916 16.753-60.67 0L512 572.669 269.321 815.35c-16.754 16.753-43.916 16.753-60.67 0-16.753-16.754-16.753-43.916 0-60.67L451.331 512 208.65 269.321c-16.753-16.754-16.753-43.916 0-60.67 16.754-16.753 43.916-16.753 60.67 0L512 451.331z"
          fill="#ffffff"
        /></svg
      >
      Cancel
    </button>
  {/if}
  {#if sendCompleted}
    <button
      disabled
      type="button"
      class="text-white bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2  inline-flex items-center"
    >
      <svg
        class="inline mr-3 w-4 h-4 "
        viewBox="0 0 1024 1024"
        width="16"
        height="16"
      >
        <path
          d="M219.952 512.576l210.432 210.432-45.248 45.256-210.432-210.432z"
          fill="#20B759"
        />
        <path
          d="M799.672 262.264l45.256 45.256-460.464 460.464-45.256-45.256z"
          fill="#20B759"
        />
      </svg>
      completed
    </button>
  {/if}
  {#if sending}
    <button
      disabled
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2  inline-flex items-center"
    >
      <svg
        role="status"
        class="inline mr-3 w-4 h-4 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Sending...
    </button>
  {/if}
  {#if !sending && !sendCompleted}
    <button
      on:click={() => addReview(newReview)}
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2  inline-flex items-center"
    >
      <svg
        class="inline mr-3 w-4 h-4 "
        viewBox="0 0 1024 1024"
        width="16"
        height="16"
        ><path
          d="M605.91 896.85a30 30 0 0 1-25.5-14.21l-167.12-270a30 30 0 0 1 4-36.7l406.2-417.86a30 30 0 0 1 49.85 30.76L634.26 876.7a30 30 0 0 1-25 20 30.41 30.41 0 0 1-3.35 0.15zM476.63 601l121.64 196.49 174-500.64z m-49.48 14.33a29.89 29.89 0 0 1-15.68-4.43L142.1 445.64a30 30 0 0 1 5.59-53.82l683.84-244.4A30 30 0 0 1 862.71 197L448.25 606.67a30 30 0 0 1-21.1 8.66z m-200.3-188.09l196 120.22 301.49-298z"
          fill="#ffffff"
        /></svg
      >
      Submit
    </button>
  {/if}
</div>
