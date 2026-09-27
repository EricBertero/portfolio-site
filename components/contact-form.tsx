"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage, type ContactField, type ContactResult } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { AlertIcon, CheckCircleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const FIELD_ORDER: ContactField[] = ["name", "email", "message"];

const INPUT_CLASSES =
  "w-full rounded-lg border bg-zinc-900/40 px-4 py-3 text-base text-foreground transition-[border-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/70";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-red-400">
      <AlertIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        <span className="sr-only">Error: </span>
        {errors[0]}
      </span>
    </p>
  );
}

interface ContactFormProps {
  successHeading: string;
  successMessage: string;
}

export function ContactForm({ successHeading, successMessage }: ContactFormProps) {
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(
    sendContactMessage,
    null,
  );

  // Fields edited since the last response; their now-stale errors are hidden.
  const [edited, setEdited] = useState<{ response: ContactResult | null; fields: ContactField[] }>({
    response: null,
    fields: [],
  });
  const editedFields = edited.response === state ? edited.fields : [];

  const [dismissedSuccess, setDismissedSuccess] = useState<ContactResult | null>(null);
  const showSuccess = state?.ok === true && dismissedSuccess !== state;

  const failed = state?.ok === false ? state : null;
  const values = failed?.values;
  const errors: Partial<Record<ContactField, string[]>> = {};
  if (failed?.fieldErrors && !pending) {
    for (const field of FIELD_ORDER) {
      const fieldErrors = failed.fieldErrors[field];
      if (fieldErrors?.length && !editedFields.includes(field)) errors[field] = fieldErrors;
    }
  }
  const errorCount = Object.keys(errors).length;

  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const wasShowingSuccess = useRef(false);

  // Move focus to where the result is: the first invalid field, or the confirmation.
  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      successHeadingRef.current?.focus();
      return;
    }
    const firstInvalid = FIELD_ORDER.find((field) => state.fieldErrors?.[field]?.length);
    if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
  }, [state]);

  useEffect(() => {
    if (wasShowingSuccess.current && !showSuccess) fieldRefs.current.name?.focus();
    wasShowingSuccess.current = showSuccess;
  }, [showSuccess]);

  const markEdited = (field: ContactField) => {
    if (!failed?.fieldErrors?.[field] || editedFields.includes(field)) return;
    setEdited({ response: state, fields: [...editedFields, field] });
  };

  const fieldClasses = (field: ContactField) =>
    cn(INPUT_CLASSES, errors[field] ? "border-red-400" : "border-zinc-500 hover:border-zinc-400");

  const describedBy = (...ids: Array<string | false>) => ids.filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex max-w-xl flex-col gap-4">
      {showSuccess ? null : (
        <form
          action={formAction}
          onSubmit={(event) => {
            if (pending) event.preventDefault();
          }}
          noValidate
          aria-label="Contact form"
          className="flex flex-col gap-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-zinc-300">
                Name
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.name = el;
                }}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                defaultValue={values?.name}
                onChange={() => markEdited("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy(Boolean(errors.name) && "contact-name-error")}
                className={fieldClasses("name")}
              />
              <FieldError id="contact-name-error" errors={errors.name} />
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                ref={(el) => {
                  fieldRefs.current.email = el;
                }}
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                defaultValue={values?.email}
                onChange={() => markEdited("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy(Boolean(errors.email) && "contact-email-error")}
                className={fieldClasses("email")}
              />
              <FieldError id="contact-email-error" errors={errors.email} />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-zinc-300">
              Message
            </label>
            <textarea
              ref={(el) => {
                fieldRefs.current.message = el;
              }}
              id="contact-message"
              name="message"
              rows={6}
              required
              minLength={10}
              maxLength={5000}
              defaultValue={values?.message}
              onChange={() => markEdited("message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy(
                !errors.message && "contact-message-hint",
                Boolean(errors.message) && "contact-message-error",
              )}
              className={cn(fieldClasses("message"), "resize-y")}
            />
            {errors.message ? (
              <FieldError id="contact-message-error" errors={errors.message} />
            ) : (
              <p id="contact-message-hint" className="mt-2 text-sm text-zinc-400">
                At least 10 characters.
              </p>
            )}
          </div>

          {/* Honeypot: invisible to people and assistive tech; bots that fill it are silently dropped. */}
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <Button
              type="submit"
              variant="solid"
              aria-disabled={pending}
              className="px-6 py-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      )}

      <div role="status" aria-live="polite">
        {showSuccess ? (
          <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-6">
            <h3
              ref={successHeadingRef}
              tabIndex={-1}
              className="flex items-center gap-2 text-base font-semibold text-foreground focus:outline-none"
            >
              <CheckCircleIcon aria-hidden="true" className="h-5 w-5 text-emerald-400" />
              {successHeading}
            </h3>
            <p className="mt-2 text-sm text-zinc-300">{successMessage}</p>
            <Button className="mt-5" onClick={() => setDismissedSuccess(state)}>
              Send another message
            </Button>
          </div>
        ) : failed?.error && !pending ? (
          <p className="flex items-start gap-1.5 text-sm text-red-400">
            <AlertIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{failed.error}</span>
          </p>
        ) : errorCount > 0 ? (
          <p className="text-sm text-red-400">
            {errorCount === 1
              ? "Please fix the highlighted field."
              : `Please fix the ${errorCount} highlighted fields.`}
          </p>
        ) : null}
      </div>
    </div>
  );
}
