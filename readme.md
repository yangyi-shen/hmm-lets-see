# hmm, let's see... 🤔

A web interface which allows you to ask AI complex questions. The backend will retrieve relevant academic materials from Crossref, process them using AI and generate an answer for you.

Note that this is not a very high-quality product. I mainly created this to introduce myself to the basics of LangChain. Cooler and actually usable projects, however, are forthcoming!

## how to use
1. Download this repository onto your computer
2. Enter the "server" directory
3. Create a .env file with the variable GROQ_API_KEY, and set it to your API key
4. Run `npm install && npm run dev`
5. Enter the "app" directory
6. Run `npm install && npm run dev`
7. Go to [localhost:5173](http://localhost:5137)

## resources

- [Crossref API documentation](https://api.crossref.org/swagger-ui/index.html#/)
- [LangChain JS documentation](https://js.langchain.com/docs/introduction/)
- [Bricolage Grotesque font](https://fonts.google.com/specimen/Bricolage+Grotesque)