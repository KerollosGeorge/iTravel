import { Navbar } from "../components/Navbar";

export const AboutUs = () => {
  return (
    <div className=" w-ful flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        <p className="mb-4">
          We are a hotel booking site that is dedicated to providing our
          customers with the best possible experience. We believe that booking a
          hotel should be easy, convenient, and stress-free, and we strive to
          make that a reality for every one of our customers.
        </p>
        <h2 className="text-2xl font-bold mb-4 mt-8">Our mission</h2>
        <p className="mb-4">
          Our mission is to make hotel booking simple and accessible to
          everyone. We want to provide our customers with a wide range of
          options, from budget-friendly hotels to luxury resorts, so that they
          can find the perfect place to stay no matter what their needs or
          budget may be.
        </p>
        <h2 className="text-2xl font-bold mb-4 mt-8">Our team</h2>
        <p className="mb-4">
          Our team is made up of experienced professionals who are passionate
          about travel and hospitality. We are committed to providing our
          customers with the best possible service, and we are always looking
          for ways to improve and innovate.
        </p>
        <h2 className="text-2xl font-bold mb-4 mt-8">Contact information</h2>
        <p className="mb-4">
          If you have any questions or comments, please don't hesitate to get in
          touch with us. You can reach us by email at
          [iTravel.support@gmail.com] or by phone at [01273201722].
        </p>
      </div>
    </div>
  );
};
