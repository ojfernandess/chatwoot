import { ref, unref, watch, onMounted, onUnmounted } from 'vue';
import { emitter } from 'shared/helpers/mitt';
import { BUS_EVENTS } from 'shared/constants/busEvents';

/**
 * Briefly highlights a conversation row when the current user receives a team-transfer notification (realtime).
 * @param {import('vue').Ref<number|string>|number|string} conversationIdRef
 */
export function useConversationTransferHighlight(conversationIdRef) {
  const isHighlighted = ref(false);
  let timer;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  const handler = payload => {
    if (payload.conversationId !== unref(conversationIdRef)) return;
    isHighlighted.value = true;
    clearTimer();
    timer = setTimeout(() => {
      isHighlighted.value = false;
    }, 12000);
  };

  onMounted(() => {
    emitter.on(BUS_EVENTS.CONVERSATION_TRANSFERRED_HIGHLIGHT, handler);
  });

  onUnmounted(() => {
    emitter.off(BUS_EVENTS.CONVERSATION_TRANSFERRED_HIGHLIGHT, handler);
    clearTimer();
  });

  watch(
    () => unref(conversationIdRef),
    () => {
      isHighlighted.value = false;
      clearTimer();
    }
  );

  return { isHighlighted };
}
