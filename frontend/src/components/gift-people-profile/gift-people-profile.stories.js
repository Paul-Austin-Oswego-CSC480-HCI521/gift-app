
import { html } from "lit";
import "./gift-people-profile.js";

export default {
  title: "Components/Gift People Profile",
  component: "gift-people-profile",
};

export const Default = {
  render: () => html`
    <gift-people-profile
      .person=${{
        id: 1,
        fullName: "Vanessa Maike",
        attributes: [],
        gifts: [
          { id: 1, name: "Headphones", status: { stage: "updated" } },
        ],
      }}
      .loading=${false}
      .error=${""}
    ></gift-people-profile>
  `,
};
