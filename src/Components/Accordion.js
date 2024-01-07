import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@gluestack-ui/themed';

export default function EasyAccordion({ items, ...otherProps }) {
  return (
    <Accordion
      variant="unfilled"
      type="single"
      isCollapsible={true}
      isDisabled={false}
      {...otherProps}
    >
      {items.map((item, index) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => (
                <>
                  <AccordionTitleText>{item.title}</AccordionTitleText>
                  {isExpanded ? (
                    <AccordionIcon as={ChevronUpIcon} ml="$3" />
                  ) : (
                    <AccordionIcon as={ChevronDownIcon} ml="$3" />
                  )}
                </>
              )}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent p="$0">
            <AccordionContentText>{item.content}</AccordionContentText>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
