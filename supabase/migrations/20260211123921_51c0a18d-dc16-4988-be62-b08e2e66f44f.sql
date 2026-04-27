CREATE POLICY "Only admins can read orders"
ON public.orders
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));