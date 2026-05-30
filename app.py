import os
import sqlite3
from datetime import datetime
from pathlib import Path

from flask import Flask, flash, redirect, render_template, request, url_for

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key")

DATA_DIR = Path("data")
DB_PATH = DATA_DIR / "messages.db"


def init_db() -> None:
  DATA_DIR.mkdir(exist_ok=True)
  with sqlite3.connect(DB_PATH) as conn:
    conn.execute(
      """
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT
      )
      """
    )
    conn.commit()


def save_message(payload: dict) -> None:
  init_db()
  with sqlite3.connect(DB_PATH) as conn:
    conn.execute(
      """
      INSERT INTO messages (name, email, message, timestamp, ip, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
      """,
      (
        payload.get("name"),
        payload.get("email"),
        payload.get("message"),
        payload.get("timestamp"),
        payload.get("ip"),
        payload.get("user_agent"),
      ),
    )
    conn.commit()


@app.route("/")
def home():
  return render_template("index.html")


@app.route("/about")
def about():
  return render_template("about.html")


@app.route("/education")
def education():
  return render_template("education.html")


@app.route("/experience")
def experience():
  return render_template("experience.html")


@app.route("/skills")
def skills():
  return render_template("skills.html")


@app.route("/certificates")
def certificates():
  return render_template("certificates.html")


@app.route("/projects")
def projects():
  return render_template("projects.html")


@app.route("/cv")
def cv():
  return render_template("cv.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
  if request.method == "POST":
    message = {
      "name": request.form.get("name", "").strip(),
      "email": request.form.get("email", "").strip(),
      "message": request.form.get("message", "").strip(),
      "timestamp": datetime.utcnow().isoformat() + "Z",
      "ip": request.remote_addr,
      "user_agent": request.headers.get("User-Agent", ""),
    }

    save_message(message)
    flash("Thanks! Your message has been received.")
    return redirect(url_for("contact"))

  return render_template("contact.html")


if __name__ == "__main__":
  init_db()
  app.run(debug=True)
