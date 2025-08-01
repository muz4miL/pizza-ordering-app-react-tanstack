import { useFormStatus } from "react-dom";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (formData) {
      return postContact(
        formData.get("name"),
        formData.get("email"),
        formData.get("message")
      );
    },
  });

  return (
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3>Submitted!</h3>
      ) : (
        <form action={mutation.mutate}>
          <ContactInput name="name" placeholder="name" required={true} />
          <ContactInput
            name="email"
            placeholder="email"
            type="email"
            required={true}
          />
          <textarea name="message" placeholder="message" required></textarea>
          <SubmitButton />
        </form>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function ContactInput({ name, placeholder, type, required }) {
  const { pending } = useFormStatus();

  return (
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      required={required}
      disabled={pending} // Disable while submitting
    />
  );
}
