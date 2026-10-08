/**
 * Inline <head> script that runs before first paint:
 * - html[data-motion="reduce"] when the visitor chose "Animasi: Kurang" or the browser asks to save data;
 * - html[data-intro="done"] when the Home hero intro already played this session.
 */
const js = `try{var d=document.documentElement;if(localStorage.getItem("lokallah:motion")==="reduce"||(navigator.connection&&navigator.connection.saveData))d.dataset.motion="reduce";if(sessionStorage.getItem("lokallah:intro"))d.dataset.intro="done"}catch(e){}`;

export function MotionPrefScript() {
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
