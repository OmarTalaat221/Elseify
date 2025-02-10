import React, { useState, useEffect, useRef } from "react";
import "./DropMenu.css";

function DropMenu({child, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropMenuRef = useRef(null);
  const parentOverflowElements = useRef([]); 

  
  const handleOverflow = (toggle) => {
    let parent = dropMenuRef.current?.parentNode;

    while (parent && parent instanceof Element) {
      const computedStyle = window.getComputedStyle(parent);
      if (
        computedStyle.overflow === "auto" ||
        computedStyle.overflow === "scroll"
      ) {
        if (toggle) {
          
          parent.classList.add("overflow-visible");
          parentOverflowElements.current.push(parent); 
        } else {
          
          parent.classList.remove("overflow-visible");
        }
      }
      parent = parent.parentNode;
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropMenuRef.current &&
        !dropMenuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false); 
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      
      parentOverflowElements.current.forEach((parent) => {
        parent.classList.remove("overflow-visible");
      });
      parentOverflowElements.current = [];
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  
  useEffect(() => {
    if (isOpen) {
      handleOverflow(true); 
    } else {
      handleOverflow(false); 
    }

    
    return () => {
      parentOverflowElements.current.forEach((parent) => {
        parent.classList.remove("overflow-visible");
      });
      parentOverflowElements.current = [];
    };
  }, [isOpen]);

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle"
        onClick={toggleDropdown}
        ref={buttonRef}
      >
        {child}
      </button>
      {isOpen && (
        <ul
          className="dropdown-menu"
          ref={dropMenuRef}
        >
          {children}
        </ul>
      )}
    </div>
  );
}

export default DropMenu;
