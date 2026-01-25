import api from "../api";

const manageLocation = {
  getProvincesByGHN: () => api.get("/location/provinces"),
  getDistrictsByGHNFromProvince: (provinceId: number) =>
    api.get(`/location/districts/${provinceId}`),
  getWardsByGHNFromDistrict: (districtId: number) => api.get(`/location/wards/${districtId}`),
};

export default manageLocation;
