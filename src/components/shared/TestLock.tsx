"use client";

import { cloneElement, isValidElement, useState } from "react";
import { Lock } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useIsTestUser } from "@/hooks/useIsTestUser";
import { cn } from "@/lib/utils";

type LockableProps = {
  className?: string;
  onClick?: React.MouseEventHandler;
  onPointerEnter?: React.PointerEventHandler;
  onPointerLeave?: React.PointerEventHandler;
  "aria-disabled"?: boolean;
};

type TestLockProps = {
  children: React.ReactElement<LockableProps>;
  message?: string;
};

/**
 * Envolve um controle de edição. Para usuários TEST, o controle fica travado:
 * o clique não executa a ação e abre um popover explicando o motivo.
 */
export const TestLock = ({
  children,
  message = "Contas de teste não podem editar dados.",
}: TestLockProps) => {
  const isTestUser = useIsTestUser();
  const [open, setOpen] = useState(false);

  if (!isTestUser || !isValidElement(children)) return children;

  const locked = cloneElement(children, {
    "aria-disabled": true,
    className: cn(children.props.className, "opacity-50 cursor-not-allowed"),
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Fecha ao clicar fora (o próprio Popover cuida disso).
      setOpen(true);
    },
    // Só ponteiro de mouse: no toque o clique já abre/fecha.
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setOpen(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setOpen(false),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>{locked}</PopoverAnchor>
      <PopoverContent
        className="w-64 text-sm flex items-start gap-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Lock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <span>{message}</span>
      </PopoverContent>
    </Popover>
  );
};
