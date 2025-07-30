import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Modal Component using React Portals
 * 
 * PORTAL CONCEPT:
 * Normally React renders components inside their parent's DOM tree
 * But modals need to appear "on top" of everything, outside the normal flow
 * 
 * Portal lets us render this modal's content into a different part of the DOM tree
 * (specifically into the #modal div in index.html)
 * 
 * WHY PORTALS FOR MODALS:
 * - Escapes parent container's CSS constraints (overflow, z-index issues)
 * - Renders at document level for proper layering
 * - Better accessibility and focus management
 * 
 * @param {ReactNode} children - Whatever you want inside the modal (forms, text, etc.)
 */
const Modal = ({ children }) => {
  // useRef creates a persistent reference to a DOM element
  // This div will be created once and reused for the lifetime of this component
  const elRef = useRef(null);
  
  // Create the div element if it doesn't exist yet
  // This only runs once thanks to the if check
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    // Find the modal container in our HTML (see index.html: <div id="modal"></div>)
    const modalRoot = document.getElementById("modal");
    
    // Append our modal div to the modal container
    // Now our modal content will render inside #modal, not inside the normal component tree!
    modalRoot.appendChild(elRef.current);
    
    // CLEANUP FUNCTION - runs when component unmounts
    // Remove our div from the DOM to prevent memory leaks
    // This is like componentWillUnmount in class components
    return () => modalRoot.removeChild(elRef.current);
  }, []); // Empty dependency array = run once on mount, cleanup on unmount

  // createPortal magic happens here!
  // Render children into our div, but the div lives inside #modal (outside normal React tree)
  // It's like a "wormhole" - component defined here, but rendered somewhere else in DOM
  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
