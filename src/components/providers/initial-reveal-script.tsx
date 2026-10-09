/**
 * Inline <head> script: the first page load reveals its streamed Suspense content without a
 * view transition (QA perf round 2).
 *
 * A prerendered page is one HTML document, but React outlines its large Suspense boundaries
 * (fallback first, content later in the same file). Because those boundaries carry
 * `<ViewTransition enter="content-in">` / `exit="skeleton-out"`, React's inline reveal script runs
 * `document.startViewTransition` while the page is still loading: it holds the content back until
 * every web font and on-screen photo has loaded (up to 500 ms), then fades it in over the skeleton.
 * That delays the first real paint (LCP) for content that was already in the HTML.
 *
 * While the page loads, `document.startViewTransition` is swapped for a stand-in that runs the
 * update at once (React reveals the content synchronously inside it) and resolves straight away, so
 * React's bookkeeping (view-transition names it sets and restores) still completes. The real one
 * comes back on the first pointer/key press or 1 s after `load`, so every client-side navigation
 * still gets its view transitions (DESIGN §7.5 #16–19).
 */
const js = `(function(){var d=document,n=d.startViewTransition;if(typeof n!=="function")return;d.startViewTransition=function(o){var u=typeof o==="function"?o:o&&o.update,p=Promise.resolve();try{var r=u&&u();r&&r.then&&r.then(null,function(){})}catch(e){}return{ready:p,finished:p,updateCallbackDone:p,skipTransition:function(){},types:new Set()}};var b=function(){if(!b)return;b=null;delete d.startViewTransition;removeEventListener("pointerdown",o,true);removeEventListener("keydown",o,true)},o=function(){b&&b()};addEventListener("pointerdown",o,true);addEventListener("keydown",o,true);addEventListener("load",function(){setTimeout(o,1000)},{once:true})})()`;

export function InitialRevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
