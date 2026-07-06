import { useEffect } from "react";

const DEFAULT_TITLE = "NovaBlog — The Premium Developer Blogging Platform by Swappy";

export default function useDocumentTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} — NovaBlog`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [title]);
}
