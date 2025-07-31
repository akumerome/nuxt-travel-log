<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps<{
    start: number;
    end: number;
}>();

const emit = defineEmits<{
    (e: 'update', value: { start: CalendarDate; end: CalendarDate }): void
}>();

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

// Convert timestamp to CalendarDate
function toCalendarDate(timestamp: number): CalendarDate {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return new CalendarDate(year, month, day);
}

const modelValue = shallowRef({
    start: toCalendarDate(props.start),
    end: toCalendarDate(props.end)
});

watch(modelValue, (newValue) => {
    emit('update', newValue)
}, { deep: true });
</script>

<template>
<UPopover>
    <UButton block color="neutral" variant="subtle">
        <template v-if="modelValue.start">
            <template v-if="modelValue.end">
                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
                <UIcon name="i-tabler-arrow-right" class="shrink-0 size-5" /> {{
                    df.format(modelValue.end.toDate(getLocalTimeZone())) }}
                <UIcon name="i-lucide-calendar" class="shrink-0 size-5" />
            </template>

            <template v-else>
                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
            </template>
        </template>
        <template v-else>
            Pick a date
        </template>
    </UButton>

    <template #content>
        <UCalendar v-model="modelValue" class="p-2" size="lg" :year-controls="false" range
            :ui="{ cellTrigger: 'm-0 rounded-none data-[selected]:bg-green-500/20 data-[selected]:text-muted data-[selection-start]:bg-green-500 data-[selection-start]:text-inverted data-[selection-start]:rounded-s-lg data-[selection-end]:bg-green-500 data-[selection-end]:text-inverted data-[selection-end]:rounded-e-lg data-[outside-view]:text-gray-300 dark:data-[outside-view]:text-gray-700', gridWeekDaysRow: 'mb-2', gridRow: 'mb-1.5' }" />
    </template>
</UPopover>
</template>