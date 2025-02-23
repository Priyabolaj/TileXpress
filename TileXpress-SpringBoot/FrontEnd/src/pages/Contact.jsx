import React, { useState } from "react";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl text-center font-semibold mt-8">
        Contact Us
      </h1>
      <div className="h-1 w-16 bg-red-500 mx-auto mt-1"></div>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-8 px-4 md:px-0 md:gap-24 md:my-16">
          <div className="flex">
            <FaLocationDot size={20} className="h-fit mt-1.5 mr-6" />
            <div>
              <p className="text-lg font-semibold">Shop address:</p>
              <p>Raintree Marg, near Bharati Vidyapeeth, CBD Belapur, Navi Mumbai, Maharashtra 400614</p>
            </div>
          </div>
          <div className="flex">
            <FaPhone size={20} className="h-fit mt-1.5 mr-6" />
            <div>
              <p className="text-lg font-semibold">Phone no:</p>
              <p>+91 8983527780</p>
            </div>
          </div>
          <div className="flex">
            <FaEnvelope size={20} className="h-fit mt-1.5 mr-6" />
            <div>
              <p className="text-lg font-semibold">Email id:</p>
              <p>info@tilexpress.com</p>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col md:mt-1">
          <div className="md:w-1/2 px-4 pt-2 mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              className="block h-full w-full rounded shadow-lg border min-h-64"
            ></iframe>
          </div>
          <div className="md:w-1/2 md:px-10 px-4 mb-8">
            <h1 className="text-3xl font-semibold mb-4">Get In Touch</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-medium">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 h-36 px-3 py-2 border rounded-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
