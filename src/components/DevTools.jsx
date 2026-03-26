import { InterfaceKit } from 'interface-kit/react';
import { Agentation } from 'agentation';
import { DialRoot } from 'dialkit';

export default function DevTools() {
  return (
    <>
      <InterfaceKit />
      <Agentation endpoint="http://localhost:4747" />
      <DialRoot position="top-right" />
    </>
  );
}
