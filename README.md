## Project Overview / Summary ✨
Men’s sports dominate the fantasy world – so we built one for women. Puck Yeah! is a fantasy league web app built to give women’s hockey the spotlight it deserves. Despite the popularity of the PWHL (North America’s biggest women’s hockey league!) in Canada and worldwide, our team saw the lack of structured platforms for fans to connect and for the incredible players that drive the team's efforts. We decided to build Puck Yeah!, a fun, (slightly) competitive application where fans can create their own fantasy leagues, featuring an AI commentator (Ms. Puck) and real stats scraped from the PWHL website.

_“When a women’s sports story does appear, it is usually a case of ‘one and done,’ a single story obscured by a cluster of men’s stories that precede it, follow it, and are longer in length.”_

## Inspiration / Problem 💡

We built Puck Yeah! to address the underrepresentation of women’s sports in media and fan engagement platforms. Many of the spaces dedicated to fans of men’s sports don’t exist for the PWHL (and women’s sports), or they are added as an afterthought; air time on major Canadian & US networks, videogames, and online fantasy leagues, to name a few. This is despite a growing interest in women’s sports, and women’s hockey specifically; the PWHL and the IIHF Women’s Worlds have both seen upticks in attendance, setting and breaking records over and over again in recent years. 

Through Puck Yeah!, we aim to amplify the successes of female athletes, increase fan engagement, and challenge the “one and done” trend in sports coverage. Women’s hockey is here to stay, and fans should be afforded the same online spaces as men’s hockey fans.

## What It Does / Features ⭐

Puck Yeah! is a hub for all things PWHL:
- Authentication System – Full-stack user registration, login, and session management.
- League Dashboard – Aggregated view of user leagues, active matchups, and league data.
- Team View – Detailed roster display with active lineup, bench, and player stats.
- Draft Engine – Prototyped player draft with search, filtering, and turn-based control logic.
- AI Integration – Google Gemini API powering Ms. Puck, a real-time AI commentator.
## How It Works / Technical Details ⚙️
We built Puck Yeah! as a full-stack web application using:
- Front End: React.js, Tailwind CSS
- Back End: Node.js and Express, MongoDB, Render, REST APISs,  JWT-based auth
- Data Integration: Pulling up-to-date statistics from the PWHL API
- AI Integration: Google Gemini API for Ms. Puck
- Notable libraries: Axios, Mongoose, React Router, Lucide Icons
## Challenges / Lessons Learned 🧠
For the majority of our team, this project was our team’s first experience with full-stack development. Key challenges included:
- Connecting frontend and backend for the first time
- Debugging data scraping and API integration issues
- Learning to structure a database and endpoints effectively
Through pair-programming, and with guidance from our mentors (shoutout Trinity and Rita!), we debugged the issues step by step and successfully integrated the two sides of the application. This allowed us to achieve full end-to-end functionality and gave us the confidence to tackle similar challenges in the future.
## Future Plans / Next Steps 🚀

We plan to:
- Improve drafting room functionalities for a smoother user experience
- Increase customizability of leagues by allowing owners to choose how teams will acquire points
- Integrate data from other major women’s sports leagues
- Continue to amplify the visibility of female athletes in sports analytics and fan engagement

We welcome feedback and contributions from the community as we expand Puck Yeah!
