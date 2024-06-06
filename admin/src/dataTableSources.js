export const userColumns = [
  {
    field: "user",
    headerName: "User",
    valueGetter: (params) =>
      `${params?.row?.firstName} ${params?.row?.lastName}`,
    width: 180,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "country",
    headerName: "Country",
    width: 100,
  },
  {
    field: "city",
    headerName: "City",
    width: 150,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
  },
  {
    field: "reviews",
    valueGetter: (params) => `${params?.row?.reviews?.length}`,
    headerName: "Reviews",
    width: 80,
  },
  {
    field: "isAdmin",
    headerName: "is Admin?",
    width: 80,
  },
];

export const hotelColumns = [
  {
    field: "HotelName",
    headerName: "Name",
    width: 180,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 220,
  },
  {
    field: "country",
    headerName: "Country",
    width: 120,
  },
  {
    field: "city",
    headerName: "City",
    width: 90,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 70,
  },
  {
    field: "rooms",
    valueGetter: (params) => `${params?.row?.rooms?.length}`,
    headerName: "Rooms",
    width: 70,
  },
  {
    field: "reviews",
    valueGetter: (params) => `${params?.row?.reviews?.length}`,
    headerName: "Reviews",
    width: 70,
  },
];

export const roomsColumns = [
  {
    field: "title",
    headerName: "Title",
    width: 120,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 550,
  },
  {
    field: "price",
    headerName: "Price",
    width: 70,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 70,
  },
  {
    valueGetter: (params) =>
      `${
        params?.row?.roomNumbers?.length > 0
          ? params?.row?.roomNumbers?.length
          : 1
      }`,
    headerName: "Rooms",
    width: 70,
  },
];

export const reviewsColumns = [
  {
    field: "content",
    headerName: "Comment",
    width: 400,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 200,
  },
  {
    field: "type",
    headerName: "Type",
    width: 200,
  },
];
