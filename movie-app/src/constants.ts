//Carousels used in the App.tsx page

export const carousels = [
  { id: "discover", title: "Discover Movies", endpoint: "/discover" },
  { id: "popular", title: "Popular Movies", endpoint: "/movie/popular" },
  { id: "top_rated", title: "Top Rated", endpoint: "/movie/top_rated" },
  { id: "now_playing", title: "Now Playing", endpoint: "/movie/now_playing" },
];

// Settings for the slider component used in the movie carousel page
export const SliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};
