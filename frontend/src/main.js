import "@carbon/styles/css/styles.css";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/link/index.js";

document.querySelector("#app").innerHTML = `
  <style>
  .no-scrolling{
        display: flex;
        flex-direction: column;
        min-height:100vh;
  }

  /*Gradiant background*/
  .gift-container{
        display: flex;
        padding: var(--Typography-Fluid-Display-Display-01-Line-height, 50px) 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 31px;
        width: 100%;
        flex: 1 0 0;
        align-self: stretch;
        box-sizing: border-box;
        background: linear-gradient(90deg, #FFC6C6 0%, #FFD7A3 100%);
        color: var(--Text-text-primary, #161616);
        font-family: var(--Font-family, "IBM Plex Sans");
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
  }

  /*The White backdrop for our gradiant background*/
   .gift-container-background{
        display: flex;
        padding: var(--End-margins, 16px) var(--Left-end-margin, 16px) var(--End-margins, 16px) var(--Right-end-margin, 16px);
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        flex: 1;
        align-self: stretch;
        background: #FFF;
   }

   .background-header{
        display: flex;
        height: 48px;
        align-items: center;
        align-self: stretch;
        border-bottom: 1px solid var(--border-subtle-background-contextual, #E0E0E0);
        background: var(--Background-background, #FFF);
   }
   .background-header button{
       color: var(--Text-text-primary, #161616);
       font-family: var(--Fixed-Heading-Font-family, "IBM Plex Sans");
       font-size: 14px;
       font-style: normal;
       line-height: 18px;
       letter-spacing: 0.16px;
   }

   .background-header button.active{
       border-right: 1px solid var(--border-subtle-background-contextual, #E0E0E0);
       font-weight: 600;
   }

   .container-header{
        display: flex;
        height: 88px;
        padding: 0 var(--Typography-Fluid-Heading-Heading-03-Size, 20px);
        flex-direction: column;
        align-items: flex-start;
        gap: var(--End-margins, 16px);
        align-self: stretch;
   }

   .footer{
        display: flex;
        flex-direction: column;
        background: var(--Layer-layer-selected-inverse, #161616);
        padding: 32px 32px;
        align-items: flex-end;
        gap: 10px;
        align-self: stretch;
   }

   .button-background{
        background: var(--Transparent, rgba(255, 255, 255, 0.00));
        border: none;
        outline: none;
        cursor: pointer;
   }
  </style>

  <div class = "no-scrolling">
      <div class = "gift-container-background">
        <header class = "background-header">
            <button type = "button" class = "button-background active">Gift App</button>
            <button type = "button" class = "button-background">Gifts</button>
            <button type = "button" class = "button-background">People</button>
        </header>
        <main class = "gift-container">
          <header class = "container-header">
             <h1>Gift App
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" fill="white" fill-opacity="0.01"/>
                <path d="M28.0006 31.36H4.00062C3.80162 31.36 3.64062 31.199 3.64062 31V14.36H3.00062C2.80162 14.36 2.64062 14.199 2.64062 14V7.99995C2.64062 7.80095 2.80162 7.63995 3.00062 7.63995H10.2576C9.27962 6.93895 8.64062 5.79195 8.64062 4.49995C8.64062 2.37195 10.3716 0.639954 12.5006 0.639954C14.0476 0.639954 15.3856 1.55495 16.0006 2.87195C16.6156 1.55495 17.9536 0.639954 19.5006 0.639954C21.6286 0.639954 23.3606 2.37095 23.3606 4.49995C23.3606 5.79195 22.7206 6.93895 21.7436 7.63995H29.0006C29.1996 7.63995 29.3606 7.80095 29.3606 7.99995V14C29.3606 14.199 29.1996 14.36 29.0006 14.36H28.3606V31C28.3606 31.199 28.1996 31.36 28.0006 31.36ZM16.3606 30.64H27.6406V14.36H16.3606V30.64ZM4.36063 30.64H15.6406V14.36H4.36063V30.64ZM16.3606 13.64H28.6406V8.35995H16.3606V13.64ZM3.36062 13.64H15.6406V8.35995H3.36062V13.64ZM16.3606 7.63995H19.5006C21.2316 7.63995 22.6406 6.23095 22.6406 4.49995C22.6406 2.76895 21.2326 1.35995 19.5006 1.35995C17.7686 1.35995 16.3606 2.76895 16.3606 4.49995V7.63995ZM12.5006 7.63995H15.6406V4.49995C15.6406 2.76895 14.2316 1.35995 12.5006 1.35995C10.7696 1.35995 9.36062 2.76895 9.36062 4.49995C9.36062 6.23095 10.7696 7.63995 12.5006 7.63995Z" fill="#161616"/>
             </svg>
             </h1>
             <p> A thoughtful gift-giving and tracking application</p>
          </header>
        </main>
      </div>

      <footer class = "footer">
      <cds-link>
        Accessibility Policy
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" slot="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
        </svg>
      </cds-link>

      <cds-link>
        About Us
      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" slot="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
      </svg>
      </cds-link>

      <cds-link>
          Follow Online
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" slot="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
        </svg>
        </cds-link>

      </footer>
  </div>
`;
