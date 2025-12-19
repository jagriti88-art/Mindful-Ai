import streamlit as st
import ollama
import base64

# --- Page Setup ---
st.set_page_config(page_title="Therapy Support AI", layout="centered")

@st.cache_data
def get_base64(file):
    try:
        with open(file, "rb") as f:
            return base64.b64encode(f.read()).decode()
    except: return ""

bin_str = get_base64("background.jpg")
if bin_str:
    st.markdown(f"""
        <style>
        .stApp {{ background-image: url("data:image/jpg;base64,{bin_str}"); background-size: cover; }}
        .stChatMessage {{ background-color: rgba(255, 255, 255, 0.9) !important; color: black !important; }}
        </style>
        """, unsafe_allow_html=True)

# --- The "Therapist" Engine ---
# This ensures the model acts as a CBT therapist right from the start.
if 'messages' not in st.session_state:
    st.session_state.messages = [
        {
            "role": "system", 
            "content": """You are a calm and empathetic Cognitive Behavioral Therapy (CBT) assistant. 
            - Your tone is gentle and professional. 
            - Validate the user's feelings first.
            - Ask short, insightful questions to help the user identify 'Cognitive Distortions'.
            - Do not give long generic advice. Keep responses under 4 sentences.
            - NEVER mention 'profile pictures', 'mentors', or 'social media'."""
        }
    ]

st.title("🌱 Therapeutic Support")

# Display history
for msg in st.session_state.messages[1:]:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# --- User Interaction ---
if prompt := st.chat_input("Tell me what's on your mind..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        response_placeholder = st.empty()
        full_response = ""
        
        # Optimized for i3: Lower temperature = less rambling
        stream = ollama.chat(
            model="phi3:mini",
            messages=st.session_state.messages,
            stream=True,
            options={
                "temperature": 0.3,  # Strictnesss
                "num_ctx": 2048,     # Smaller context window for i3 speed
                "stop": ["User:", "Human:"] # Prevent it from talking to itself
            }
        )
        
        for chunk in stream:
            content = chunk['message']['content']
            full_response += content
            response_placeholder.write(full_response + "▌")
        
        response_placeholder.write(full_response)
        st.session_state.messages.append({"role": "assistant", "content": full_response})