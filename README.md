# Horizon Event Hub

Design a modern dashboard, from the perspective of a guest willing to apply.

First, I need you to create the navbar, the top left should consist of the company logo. Then, a navy blue sidebar on the left of the screen, consisting of options such as Overview, Attendees, Event Timeline, etc.

On the bottom left, at the very end of the sidebar, add a stock profile picture, with a dropdown menu showcasing other options when opened such as "profile", "settings", etc.
Along with it, add a Dark and Light theme button, Moon sign when in light mode, clicking it should turn it into Dark mode, and while in dark mode, it should have a sun sign to turn it into Light.

Back to the Navbar, add an event name, such as "Horizon Retrieve". It should be a sticky navbar so that it stays even after we scroll down further into the page.

In the Hero area, add a short introductory line for the event itself, something along the lines of "Connecting professionals from various industries".

Add a suitable graphic alongside it.

In the main content area, add 3 KPI cards, consisting of the number of People who have applied so far, The number of remaining seats, The total number of speakers.

At the very bottom of all the pages, add the following contact details:
email: horizonsupport@gmail.com
phone numbers: +01 23 23 23 23, +33 1 92 39 39 39
add other details

Back to the main area, add a CTA button, prompting the user to apply for the event with the text, "Grab your seat now!". Upon clicking which, a Modal page should appear, without taking the user off the webpage, it should show them the available options, ranging from student for $59, to professional, $109, to VIP $499 (limited)

It should prompt them to fill out their details such as Name, Contact email, their method of payment, etc and should make them agree to the Code of Conduct for the event, make "Code of Conduct" as highlighted and clickable to open a code of conduct page with generic rules for now. They should NOT be able to submit without filling out all of their details. The option to submit should only unlock after all details have been filled appropriately.

In the sidebar, replace attendees with "speakers", and add a list of speakers. We should be able to filter out the speaker on the basis of their department, on the basis of the event dates (since it will be a 3 day event starting on the 2nd of December, 2026 running all the way to 5th of December, 2026.) Add a search option to search speakers by name with the appropriate filtering. Use pagination to separate a list of 80 speakers into appropriate pages of 20 each.

In the settings option, in the profile's dropdown menu in the bottom left, make it clickable and bring up a Modal which permits the user to change their profile picture, their contact details, and an option to upgrade from their ticket. For instance, if it is a student ticket, prompt them to upgrade to a professional package etc.

The overall design of the dashboard should be clean, not bloated, minimalistic and simple but effective.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/31fb83ed-04d8-43ef-a433-4ff644818422).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
