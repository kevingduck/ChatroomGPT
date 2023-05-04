# ChatroomGPT

Welcome to the ChatroomGPT repository! 

This application allows you to **create chat rooms where you can chat with other people and interact with ChatGPT**. 

This simple app provides a shared prompting experience, enabling users to engage with ChatGPT collaboratively.


https://user-images.githubusercontent.com/2180038/236108460-a09f1a50-b95e-4772-82f7-612b76df6ff4.mp4


## Features
- Start a chat room and get shareable link instantly that you can send to others.
- Use "/gpt" to send your message to ChatGPT (e.g., "/gpt who was the first person in space?").
- Create ~infinite chat rooms.
- Export chat history to TXT files or copy to clipboard.
- Hot-switch between fast and smart models for ChatGPT.
- HTML-supported prompts! (e.g., "/gpt give me a colorful HTML table with a meal plan for a week").

## Coming Soon
- Peristent chat storage
- Streaming responses word-by-word like ChatGPT

## Getting Started
To get started with the ChatroomGPT app, follow these steps:

### Prerequisites
- Ensure you have Python and Flask installed on your system.

### Installation
1. Clone the repository to your local machine:
   ```
   git clone https://github.com/your-username/ChatroomGPT.git
   ```

2. Navigate to the project directory:
   ```
   cd ChatroomGPT
   ```

3. Install the required dependencies:
   ```
   pip install flask openai
   ```

4. __Important!__ In app.py, add your OpenAI API key from https://platform.openai.com/account/api-keys

   ```
   openai.api_key={enter your key}
   ```

### Running the Application
1. Start the Flask application:
   ```
   flask run
   ```

2. Open your web browser and navigate to the URL displayed in the terminal (usually `http://127.0.0.1:5000/`).

3. Enjoy chatting with your friends and interacting with ChatGPT!

## Contributing
Feel free to contribute to this project by opening issues or submitting pull requests. Your contributions are greatly appreciated!


## Contact
If you have any questions or suggestions, feel free to reach out to the repository owner.

Thank you for using ChatroomGPT!
