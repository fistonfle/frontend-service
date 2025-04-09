const url = import.meta.env.PROD
  ? "https://api.famgold.savetoserve.rw/api"
  : "http://localhost:8000/api";

export default url;
