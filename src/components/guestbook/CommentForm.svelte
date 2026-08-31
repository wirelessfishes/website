<script lang="ts">
  import AeroButton from "@components/AeroButton.svelte";
  import { colors } from "@scripts/colors";
  import type { GuestbookPostBody } from "@scripts/types/guestbook";
  import validator from "validator";

  let name: string = $state("");
  let website_url: string = $state("");
  let comment_content: string = $state("");
  let reply_to: number | undefined = $state();
  let valid_comment: boolean = $state(false);

  function validateForm() {
    if (name.trim().length <= 0) {
      return false;
    }

    if (website_url.trim().length > 0) {
      if (!validator.isURL(website_url.trim())) {
        return false;
      }
    }

    if (comment_content.trim().length <= 0) {
      return false;
    }

    return true;
  }

  function onInput() {
    valid_comment = validateForm();
  }

  const guesbook_post_data: GuestbookPostBody = $derived({
    name,
    content: comment_content,
    site: website_url,
    reply_to,
  });

  async function submitComment() {
    alert(`Implement submitting the form LOL\n${JSON.stringify(guesbook_post_data)}`);
  }
</script>

<form class="content-padding" oninput={onInput}>
  <div class="form_head">
    <!-- NAME -->
    <div class="input_group">
      <label for="form_name">Name <span style="color: var(--red)">*</span></label>
      <input bind:value={name} id="form_name" name="name" placeholder="Jane Doe" type="text" required />
    </div>

    <!-- WEBSITE -->
    <div class="input_group">
      <label for="form_url">Your website <span style="color: var(--lightgrey)">(Optional)</span></label>
      <input bind:value={website_url} id="form_url" name="your website" placeholder="https://example.com" type="url" />
    </div>
  </div>

  <!-- MESSAGE -->
  <div class="input_group">
    <label for="form_message">Message <span style="color: var(--red)">*</span></label>
    <textarea
      bind:value={comment_content}
      id="form_message"
      name="message"
      placeholder="Rat activiy has increased exponentially"
      required
    ></textarea>
  </div>

  <AeroButton disabled={!valid_comment} onclick={submitComment} color={colors.blue}>Submit</AeroButton>
</form>

<style>
  label {
    margin-left: 0.2em;
    margin-bottom: 2px;
  }

  .input_group {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  #form_name,
  #form_url {
    width: 100%;
  }

  #form_message {
    height: 4em;
    text-align: left;
    width: 100%;
  }

  .form_head {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
</style>
