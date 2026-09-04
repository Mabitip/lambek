import { requirePermission } from "@/lib/auth/session";
import {
  contactMessageRepository,
  tradeInquiryRepository,
  sampleRequestsRepository,
  subscribersRepository,
} from "@/lib/repositories/contact.repository";
import { InquiriesManager } from "@/components/admin/InquiriesManager";

export default async function AdminInquiriesPage() {
  await requirePermission("MANAGE_INQUIRIES");

  const [messagesRes, inquiriesRes, samplesRes, subscribersRes] = await Promise.all([
    contactMessageRepository.findAll({ limit: 100 }).catch(() => ({ items: [] })),
    tradeInquiryRepository.findAll({ limit: 100 }).catch(() => ({ items: [] })),
    sampleRequestsRepository.findAll({ limit: 100 }).catch(() => ({ items: [] })),
    subscribersRepository.findAll({ limit: 100 }).catch(() => ({ items: [] })),
  ]);

  return (
    <InquiriesManager
      initialContactMessages={JSON.parse(JSON.stringify(messagesRes.items))}
      initialInquiries={JSON.parse(JSON.stringify(inquiriesRes.items))}
      initialSampleRequests={JSON.parse(JSON.stringify(samplesRes.items))}
      initialSubscribers={JSON.parse(JSON.stringify(subscribersRes.items))}
    />
  );
}
