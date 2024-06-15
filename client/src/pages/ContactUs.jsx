import { Navbar } from "../components/Navbar";

export const ContactUs = () => {
  return (
    <div className=" w-ful flex flex-col">
      <Navbar />
      <div className="w-full flex flex-col mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <p className="mb-4">
          We would love to hear from you! If you have any questions, comments,
          or concerns, please don't hesitate to get in touch with us. You can
          reach us by email, phone, or by filling out the contact form below.
        </p>
        <div className="w-[50%] self-center max-sm:w-full min-w-[350px]">
          <h2 className="text-2xl font-bold mb-4 mt-8">Contact form</h2>
          <form className=" shadow-md shadow-[gray] p-4 rounded-md">
            <div className="mb-4">
              <label htmlFor="name" className="block  font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block  font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block  font-bold mb-2">
                Message
              </label>
              <textarea
                id="message"
                className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              // onClick={handleSubmit}
            >
              Send Message
            </button>
          </form>
        </div>
        <h2 className="text-2xl font-bold mb-4 mt-8">Contact information</h2>
        <p className="mb-4">
          You can also reach us by email at [iTravel.support@gmail.com] or by
          phone at [01273201722].
        </p>
      </div>
    </div>
  );
};
