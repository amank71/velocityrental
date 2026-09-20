import swiftImage from "@/assets/swift.jpg";
import cretaImage from "@/assets/creta.jpg";
import cityImage from "@/assets/city.jpg";
import innovaImage from "@/assets/innova.jpg";

export type VehicleType = "hatchback" | "suv" | "sedan" | "muv";
export type VehicleStatus = "available" | "maintenance";

export type Vehicle = {
  id: number;
  registration: string;
  name: string;
  type: VehicleType;
  year: number;
  seats: number;
  dailyRate: number;
  status: VehicleStatus;
  odometer: number;
  transmission: "Manual" | "Automatic";
  fuel: "Petrol" | "Diesel";
  image: string;
};

export const vehicles: Vehicle[] = [
  { id: 1, registration: "DL01AB1234", name: "Maruti Suzuki Swift", type: "hatchback", year: 2022, seats: 5, dailyRate: 1800, status: "available", odometer: 24500, transmission: "Manual", fuel: "Petrol", image: swiftImage },
  { id: 2, registration: "DL01CD5678", name: "Hyundai Creta", type: "suv", year: 2023, seats: 5, dailyRate: 3200, status: "available", odometer: 12000, transmission: "Automatic", fuel: "Petrol", image: cretaImage },
  { id: 3, registration: "DL01EF9012", name: "Honda City", type: "sedan", year: 2021, seats: 5, dailyRate: 2600, status: "maintenance", odometer: 38000, transmission: "Automatic", fuel: "Petrol", image: cityImage },
  { id: 4, registration: "DL01GH3456", name: "Toyota Innova Crysta", type: "muv", year: 2022, seats: 7, dailyRate: 4200, status: "available", odometer: 30000, transmission: "Manual", fuel: "Diesel", image: innovaImage },
];

export type DemoBooking = {
  reference: string;
  customer: string;
  phone: string;
  vehicle: string;
  registration: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Reserved" | "Completed";
  total: number;
  paid: number;
  paymentStatus: "Paid" | "Pending" | "Part paid";
};

export const sampleBookings: DemoBooking[] = [
  { reference: "VLC-1001", customer: "Aarav Sharma", phone: "9876543210", vehicle: "Maruti Suzuki Swift", registration: "DL01AB1234", startDate: "20 Sep 2026", endDate: "22 Sep 2026", status: "Active", total: 5400, paid: 3000, paymentStatus: "Part paid" },
  { reference: "VLC-1002", customer: "Meera Iyer", phone: "9876501234", vehicle: "Hyundai Creta", registration: "DL01CD5678", startDate: "23 Sep 2026", endDate: "25 Sep 2026", status: "Reserved", total: 9600, paid: 0, paymentStatus: "Pending" },
  { reference: "VLC-1003", customer: "Kabir Khan", phone: "9876512345", vehicle: "Toyota Innova Crysta", registration: "DL01GH3456", startDate: "13 Sep 2026", endDate: "16 Sep 2026", status: "Completed", total: 16800, paid: 16800, paymentStatus: "Paid" },
];

export const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export function rentalDays(start: string, end: string) {
  const startTime = new Date(`${start}T00:00:00`).getTime();
  const endTime = new Date(`${end}T00:00:00`).getTime();
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime < startTime) return 0;
  return Math.max(1, Math.round((endTime - startTime) / 86400000) + 1);
}
