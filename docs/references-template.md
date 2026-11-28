# Reference stripe template

Paste this block back into a page (Home: before the habit band; Coach and Skipper: before the night band "How we work together"; Programs: before "Format"), replace the placeholders with real, consented quotes in the page language, remove the `hidden` attribute and the comment. CSS (`.references`) and the carousel script in `site.js` are already in place.

Labels: Home "What people say" / "Co o mně říkají"; Coach "What clients say" / "Co říkají klienti"; Programs "From a week on board" / "Z týdne na palubě"; Skipper "From crews and owners" / "Od posádek a majitelů".

```html
<!-- References: replace the placeholder quotes with real ones (with the client's consent), add or remove
     <figure class="reference"> items (the first one keeps "is-active"), then delete the "hidden" attribute.
     Preview while hidden: add ?references to the page URL. -->
<section class="references" aria-roledescription="carousel" aria-labelledby="references-title-coach" data-references hidden>
  <div class="wrap">
    <p class="references-label" id="references-title-coach">What clients say</p>
    <div class="references-track" aria-live="polite">
      <figure class="reference is-active">
        <blockquote>[Client quote: one to three sentences in their own words.]</blockquote>
        <figcaption><span class="reference-name">[Name or role]</span> <span class="reference-context">[Context, e.g. 1:1 coaching, 2025]</span></figcaption>
      </figure>
      <figure class="reference">
        <blockquote>[Client quote: one to three sentences in their own words.]</blockquote>
        <figcaption><span class="reference-name">[Name or role]</span> <span class="reference-context">[Context, e.g. 1:1 coaching, 2025]</span></figcaption>
      </figure>
    </div>
  </div>
</section>

```
