export type ServiceId =
  | "holiday-tuition"
  | "boot-camps"
  | "career-talks"
  | "guidance-counselling";

export interface Service {
  id: ServiceId;
  name: string;
  price: number;
  description: string;
}

export const services: Service[] = [
  {
    id: "holiday-tuition",
    name: "Holiday Tuition and Mentorship",
    price: 2,
    description:
      "Structured holiday tuition blended with one-on-one mentorship. We reinforce core subjects, build study routines, and connect learners with mentors who model excellence.",
  },
  {
    id: "boot-camps",
    name: "Boot Camps",
    price: 2,
    description:
      "High-impact academic and skills boot camps designed for focused progress in a short time. Learners collaborate in high-energy sessions, tackle practice work, and receive targeted feedback.",
  },
  {
    id: "career-talks",
    name: "Career Talks",
    price: 2,
    description:
      "Inspiring, interactive career talks that expose students to real career journeys and future pathways. Ideal for schools seeking practical guidance and motivation for their learners.",
  },
  {
    id: "guidance-counselling",
    name: "Guidance and Counselling",
    price: 2,
    description:
      "Confidential, student-centered guidance for academic, social, and emotional challenges. We support learners and families to navigate big decisions with clarity and confidence.",
  },
];

export function getServiceById(
  id: string | null | undefined
): Service | undefined {
  return services.find((service) => service.id === id);
}

export function formatPrice(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}
